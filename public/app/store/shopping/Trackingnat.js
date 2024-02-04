
Ext.define('PHNet.store.shopping.Trackingnat', {
	extend: 'Ext.data.TreeStore',
    model: 'PHNet.model.shopping.Trackingnat',
    autoLoad: false,
    listeners: {
        load: function(store, records, successful, eOpts ) {
            let counter  = 0;        
            store.getRootNode().cascadeBy(function () { counter++; });
            
            if(counter - 1 == 0) {
                Ext.getCmp('natexportbtn').setDisabled(true);
            }
            else {
                Ext.getCmp('natexportbtn').setDisabled(false);
            }
        }
    },
    proxy: {
        type: 'ajax',
		url : '',
		reader:{
			type: 'json'
        }
	}
});