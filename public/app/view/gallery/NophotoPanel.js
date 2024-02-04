Ext.Loader.setConfig({enabled: true});
Ext.define('PHNet.view.gallery.NophotoPanel', {
    extend: 'Ext.panel.Panel',
    id: 'gallery-nophoto-panel',
    width: 260,
    height: 500,
    title: 'Foto del Producto',
    bodyStyle: {
        "background-color": "#F7FBFE"
    },
    listeners: {
        'afterrender': function(panel) {
            Ext.get('gallery-nophoto-main').slideIn('l', {
                easing: 'elasticIn',
                duration: 2000
            });
        }
    },
    html: '<div id="gallery-nophoto-main">' +
            '<div class="gallery-nophoto-img">' +
                '<span class="fa-stack fa-5x">' +
                '<i class="fas fa-camera fa-stack-1x"></i>' +
                '<i class="fas fa-ban fa-stack-2x" style="color:Tomato"></i>' +
                '</span>' +
            '</div>' +
            '<div class="gallery-nophoto-text">' +
                '<h2>' +
                'Sin Foto' +
                '</h2>' +
            '</div>'+
            '<div id="nophoto-product" class="gallery-nophoto-product">' +
            '</div>'+
            '<div class="gallery-help-text">' +
                '<p>' +
                'Seleccione la Foto de este producto en la galer\xEDa, o Agr\xE9guela.' +
                '</p>' +
            '</div>'+
          '</div>',
})