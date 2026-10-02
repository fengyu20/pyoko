/* ============================================================================
   Phase 2 ランタイム：現在地からの距離
   coords.js の COORDS 定義の直後に貼り付けてください。

   ・位置情報は「現在地を使う」を押したときだけ取得します（勝手に聞かない）
   ・表示するのは直線距離です。徒歩距離ではありません
   ・座標が無い施設は距離なし＝「近い順」では最後に回します
   ========================================================================== */

let userPos = null;          // { lat, lon, accuracy }
let geoState = 'idle';       // idle | asking | ok | denied | error

function nearbyText(key, vars, fallback) {
  return typeof window !== 'undefined' && typeof window.uiText === 'function'
    ? window.uiText(key, vars, fallback)
    : fallback;
}

function syncLocationDependentControls() {
  const radius = document.getElementById('radiusFilter');
  const nearOption = document.getElementById('sortNearOption');
  const hasLocation = Boolean(userPos);
  if (radius) {
    radius.disabled = !hasLocation;
    radius.setAttribute('aria-disabled', String(!hasLocation));
    radius.title = hasLocation ? '' : nearbyText('geo.radiusNeedsLocation', {}, '距離を指定するには、先に現在地を取得してください');
    if (!hasLocation) radius.value = '0';
  }
  if (nearOption) nearOption.disabled = !hasLocation;
}

/*
 * Map view has its own entry to this one location state. It is presentation
 * only: the position, the permission prompt and `geoState` stay here, so the
 * two buttons can never disagree or ask twice.
 */
function syncMapLocateButton() {
  const button = document.getElementById('mapLocateBtn');
  if (!button) return;
  const asking = geoState === 'asking';
  const located = Boolean(userPos);
  button.disabled = asking;
  button.setAttribute('aria-busy', String(asking));
  button.classList.toggle('is-located', located && !asking);
  button.setAttribute('aria-label', nearbyText(
    located ? 'map.recenterAria' : 'map.locateAria',
    {},
    located ? '地図を現在地に戻す' : '現在地を取得して地図を移動'
  ));
  const label = button.querySelector('.map-locate-label');
  if (label) {
    label.textContent = asking
      ? nearbyText('geo.loading', {}, '取得中…')
      : nearbyText('map.locate', {}, '現在地');
  }
}

function refreshLocationUi() {
  syncLocationDependentControls();
  syncMapLocateButton();
  const btn = document.getElementById('geoBtn');
  const btnLabel = btn?.querySelector('.geo-btn-label');
  const note = document.getElementById('geoNote');
  if (btnLabel) {
    btnLabel.textContent = geoState === 'asking'
      ? nearbyText('geo.loading', {}, '取得中…')
      : geoState === 'ok'
        ? nearbyText('geo.update', {}, '現在地を更新')
        : nearbyText('geo.use', {}, '現在地を使う');
  }
  if (!note) return;
  if (geoState === 'asking') {
    note.textContent = nearbyText('geo.loadingNote', {}, '現在地を取得しています…');
    return;
  }
  if (geoState === 'ok' && userPos) {
    note.textContent = nearbyText('geo.success', { meters: Math.round(userPos.accuracy) }, `現在地を取得しました（誤差およそ${Math.round(userPos.accuracy)}m）`);
    return;
  }
  if (geoState === 'denied') {
    note.textContent = nearbyText('geo.denied', {}, '位置情報の利用がブロックされています。ブラウザのアドレスバーの設定から許可してください');
    return;
  }
  if (geoState === 'error') {
    note.textContent = nearbyText('geo.error', {}, '現在地を取得できませんでした。電波の良い場所でもう一度お試しください');
    return;
  }
  note.textContent = nearbyText('geo.idle', {}, '必要な時だけ位置情報を取得');
}

function haversineM(a, b) {
  const R = 6371000, rad = d => d * Math.PI / 180;
  const dLat = rad(b.lat - a.lat), dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 +
            Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function formatDistance(m) {
  if (m < 1000) return `${Math.round(m / 10) * 10}m`;
  return `${(m / 1000).toFixed(m < 10000 ? 1 : 0)}km`;
}

/* --- 各カードに距離を書き込む ------------------------------------------
   renderCard には手を入れず、必要な要素をこの関数側で差し込みます。
---------------------------------------------------------------------- */
function updateDistances() {
  DATA.forEach(area => {
    area.facilities.forEach(f => {
      const key = f._key || `${f.no}-${f.name}`;
      const card = document.getElementById(`card-${key}`);
      const wrap = document.getElementById(`status-wrap-${key}`);
      if (!card || !wrap) return;

      let el = document.getElementById(`dist-${key}`);
      if (!el) {
        el = document.createElement('span');
        el.id = `dist-${key}`;
        el.className = 'dist-badge';
        wrap.parentNode.insertBefore(el, wrap.nextSibling);
      }

      const c = COORDS[key];
      if (!userPos || !c) {
        el.hidden = true;
        card.dataset.dist = '';
        return;
      }

      const d = haversineM(userPos, { lat: c[0], lon: c[1] });
      card.dataset.dist = Math.round(d);
      el.hidden = false;
      el.textContent = nearbyText('geo.distance', { distance: formatDistance(d) }, `📍 直線 ${formatDistance(d)}`);
      el.title = nearbyText('geo.distanceTitle', {}, '直線距離です。実際の歩行距離・所要時間とは異なります');
    });
  });
}

/* --- 現在地の取得 ------------------------------------------------------- */
function requestLocation(onDone) {
  const btn = document.getElementById('geoBtn');
  const btnLabel = btn?.querySelector('.geo-btn-label');
  const note = document.getElementById('geoNote');
  const setNote = (text, cls) => {
    if (!note) return;
    note.textContent = text;
    note.className = `geo-note ${cls || ''}`;
  };

  if (!navigator.geolocation) {
    geoState = 'error';
    syncMapLocateButton();
    setNote(nearbyText('geo.unsupported', {}, 'このブラウザは位置情報に対応していません'), 'geo-err');
    return;
  }

  geoState = 'asking';
  syncMapLocateButton();
  if (btn) btn.disabled = true;
  if (btnLabel) btnLabel.textContent = nearbyText('geo.loading', {}, '取得中…');
  setNote(nearbyText('geo.loadingNote', {}, '現在地を取得しています…'));

  navigator.geolocation.getCurrentPosition(
    pos => {
      userPos = {
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
        accuracy: pos.coords.accuracy
      };
      geoState = 'ok';
      syncLocationDependentControls();
      syncMapLocateButton();
      if (btn) btn.disabled = false;
      if (btnLabel) btnLabel.textContent = nearbyText('geo.update', {}, '現在地を更新');
      setNote(nearbyText('geo.success', { meters: Math.round(pos.coords.accuracy) }, `現在地を取得しました（誤差およそ${Math.round(pos.coords.accuracy)}m）`), 'geo-ok');
      updateDistances();
      if (onDone) onDone();
    },
    err => {
      geoState = err.code === err.PERMISSION_DENIED ? 'denied' : 'error';
      syncLocationDependentControls();
      syncMapLocateButton();
      if (btn) btn.disabled = false;
      if (btnLabel) btnLabel.textContent = nearbyText('geo.use', {}, '現在地を使う');
      setNote(
        err.code === err.PERMISSION_DENIED
          ? nearbyText('geo.denied', {}, '位置情報の利用がブロックされています。ブラウザのアドレスバーの設定から許可してください')
          : nearbyText('geo.error', {}, '現在地を取得できませんでした。電波の良い場所でもう一度お試しください'),
        'geo-err'
      );
      if (onDone) onDone();
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
  );
}

/* --- 半径フィルタの判定（applyFilters から呼ぶ）------------------------ */
function withinRadius(card, radiusM) {
  if (!radiusM) return true;              // 「指定なし」
  if (!userPos) return true;              // 現在地が無いなら絞らない
  const d = Number(card.dataset.dist);
  if (!card.dataset.dist || !Number.isFinite(d)) return false;  // 座標なしは除外
  return d <= radiusM;
}
