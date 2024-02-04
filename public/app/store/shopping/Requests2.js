Ext.define('PHNet.store.shopping.Requests', {
	extend: 'Ext.data.TreeStore',
    model: 'PHNet.model.shopping.Requests',
    autoLoad: false,
    proxy: {
        type: 'ajax',
		url : '',
		reader:{
			type: 'json'
        }
	}
});