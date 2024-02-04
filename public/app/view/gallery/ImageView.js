Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath('Ext.ux.DataView', 'extjs42/examples/ux/DataView/');

Ext.define('PHNet.view.gallery.ImageView', {
    extend: 'Ext.view.View',
    alias : 'widget.galleryimageview',
    id: 'galleryimageview',
    requires: [
        'Ext.ux.DataView.Animated',
        'Ext.data.Store'
    ],
    mixins: {
        dragSelector: 'Ext.ux.DataView.DragSelector',
        draggable   : 'Ext.ux.DataView.Draggable'
    },
    plugins : [
        Ext.create('Ext.ux.DataView.Animated', {
            duration  : 550,
            idProperty: 'src'
        })
    ],
    
    tpl: [
        '<tpl for=".">',
            '<div id="view-thumb-{name}" class="thumb-wrap">',
                '<div class="thumb">',
                    (!Ext.isIE6? '<img class="gallery-thumbnails" src="/phnet.compras/storage/app/public/products/thumbnails/{src}" width="100" height="70" />' : 
                    '<div stynamele="width:100px;height:70px;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'/phnet.compras/storage/app/public/products/thumbnails/{src}\')"></div>'),
                '</div>',
                '<span>{name}</span>',
            '</div>',
        '</tpl>'
    ],
    
    itemSelector: 'div.thumb-wrap',
    multiSelect: false,
    singleSelect: true,
    cls: 'x-image-view',
    autoScroll: true,
    
    initComponent: function() {
        this.store = Ext.create('PHNet.store.Gallery');
        
        this.mixins.dragSelector.init(this);
        this.mixins.draggable.init(this, {
            ddConfig: {
                ddGroup: 'organizerDD'
            },
            ghostTpl: [
                '<tpl for=".">',
                    '<img class="gallery-thumbnails" src="/phnet.compras/storage/app/public/products/thumbnails/{src}" width="100" height="70" />',
                    '<tpl if="xindex % 5 == 0"><br /></tpl>',
                '</tpl>',
                '<div class="count">',
                    '{[values.length]} images selected',
                '<div>'
            ]
        });
        
        this.callParent();
    }
});