Ext.Loader.setConfig({enabled: true});
Ext.define('PHNet.view.gallery.PhotoPanel', {
    extend: 'Ext.panel.Panel',
    id: 'gallery-photo-panel',
    width: 260,
    height: 500,
    title: 'Foto del Producto',
    bodyStyle: {
        "background-color": "#F7FBFE"
    },
    listeners: {
        'afterrender': function(panel) {
            Ext.get('gallery-photo-main').slideIn('l', {
                easing: 'elasticIn',
                duration: 2000
            });
        }
    },
    html: '<div id="gallery-photo-main">' +
            '<div id="product-photo-img" class="photo-img"></div>' +
            '<div id="product-photo-link" class="photo-link"></div>' +
            '<div id="product-photo-deselect" class="photo-del">Quitar Foto</div>' +
            '<div id="product-name" class="photo-product">' +
            '</div>' +
            '<div class="gallery-help-text">' +
                '<p>' +
                'Para cambiar, seleccione la Foto en la galer\xEDa, o Agr\xE9guela.' +
                '</p>' +
            '</div>' +
          '</div>',
})