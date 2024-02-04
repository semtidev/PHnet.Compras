Ext.Loader.setConfig({enabled: true});
Ext.define('PHNet.view.gallery.SelectPhotoPanel', {
    extend: 'Ext.panel.Panel',
    id: 'gallery-selectphoto-panel',
    width: 260,
    height: 490,
    title: 'Seleccionar Foto',
    bodyStyle: {
        "background-color": "#F7FBFE"
    },
    listeners: {
        'afterrender': function(panel) {
            Ext.get('gallery-nophoto-main').slideIn('l', {
                easing: 'easeIn',
                duration: 200
            });
        }
    },
    html: '<div id="gallery-nophoto-main">' +
            '<div id="photo-img" class="photo-img"></div>' +
            '<div id="photo-link" class="photo-link"></div>' +
            '<div>' +
                '<div id="photo-label-category"></div>' +
                '<div id="photo-label-desc"></div>' +
            '</div>'+
            '<div class="gallery-help-text">' +
                '<p>' +
                'Haga clic en el bot\xF3n "Aceptar" para asignar esta Foto al producto.' +
                '</p>' +
            '</div>'+
          '</div>',
})