
L.HeatMapLayer = L.Layer.extend({

    initialize: function (options) {
        this._latlngs = options.latlngs;
        this._radius = (options.radius == undefined) ? 8 : options.radius;
        this._blurSize = (options.blur_size == undefined) ? 12 : options.radius;
    },

    onAdd: function (map) {
        this._map = map;
        this.createHeatCanvas();
        map.on("moveend", this.addLocationsToCanvas, this);
        this.addLocationsToCanvas();
    },

    createHeatCanvas: function () {

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

        this._canvasContainer = container;
        this._heat = simpleheat(canv);
        this._heat.radius(this._radius, this._blurSize);
        this._map.getPanes().overlayPane.appendChild(this._canvasContainer);
    },

    resetCanvasContainerPosition: function () {
        var bounds = this._map.getBounds();
        var topLeft = this._map.latLngToLayerPoint(bounds.getNorthWest());
        L.DomUtil.setPosition(this._canvasContainer, topLeft);
    },

    addLocationsToCanvas: function () {

        this.resetCanvasContainerPosition();
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
    }
});

L.heatMapLayer = function (latlngs, options) {
    return new L.HeatMapLayer(latlngs, options);
};
