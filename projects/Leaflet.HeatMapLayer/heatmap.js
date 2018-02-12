
L.HeatMapLayer = L.Layer.extend({

    initialize: function (latlngs, options) {
        this._latlngs = latlngs;
    },

    onAdd: function (map) {
        this._map = map;
        this._initHeatCanvas();
        map.on("moveend", this._redraw, this);
        this._redraw();
    },

    onRemove: function (map) {
        map.getPanes().overlayPane.removeChild(this._div);
        map.off("moveend", this._redraw, this);
    },

    _initHeatCanvas: function () {

        var container = L.DomUtil.create('div', 'leaflet-heatmap-container');
        container.style.position = 'absolute';
        container.style.width = this._map.getSize().x + "px";
        container.style.height = this._map.getSize().y + "px";

        var canv = document.createElement("canvas");
        canv.width = this._map.getSize().x;
        canv.height = this._map.getSize().y;
        canv.style.width = canv.width + "px";
        canv.style.height = canv.height + "px";
        canv.style.opacity = this._opacity;
        container.appendChild(canv);

        this._div = container;
        this._heat = simpleheat(canv);
        this._heat.radius(8, 12);
        this._map.getPanes().overlayPane.appendChild(this._div);
    },

    _resetCanvasPosition: function () {
        var bounds = this._map.getBounds();
        var topLeft = this._map.latLngToLayerPoint(bounds.getNorthWest());
        L.DomUtil.setPosition(this._div, topLeft);
    },

    _redraw: function () {
        this._resetCanvasPosition();
        var data = [];
        if (this._latlngs.length > 0) {
            for (var i = 0, l = this._latlngs.length; i < l; i++) {
                var lonlat = new L.LatLng(this._latlngs[i].lat, this._latlngs[i].lon);
                var localXY = this._map.latLngToLayerPoint(lonlat);
                localXY = this._map.layerPointToContainerPoint(localXY);
                data.push([
                    Math.floor(localXY.x),
                    Math.floor(localXY.y),
                    this._latlngs[i].v
                ]);
            }
        }
        this._heat.data(data).draw();
        return this;
    },

    redraw: function () {
        this._redraw();
    }

});

L.heatMapLayer = function (latlngs, options) {
    return new L.HeatMapLayer(latlngs, options);
};
