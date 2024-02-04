Ext.define('PHNet.store.Gallery', {
    extend: 'Ext.data.Store',
    autoLoad: true,
    fields: ['id', 'name', 'description', 'category', 'src'],
    proxy: {
        pageParam: false, //to remove param "page"
        startParam: false, //to remove param "start"
        limitParam: false, //to remove param "limit"
        noCache: false, //to remove param "_dc"
        type: 'ajax',
        url : '/phnet.compras/public/api/gallery',
        reader: {
            type: 'json',
            root: 'photos'
        }
    }
});