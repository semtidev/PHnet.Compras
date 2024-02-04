Ext.define('PHNet.store.shopping.Trackingimp', {
    extend: 'Ext.data.TreeStore',
    model: 'PHNet.model.shopping.Trackingimp',
    autoLoad: false,
    listeners: {
        load: function(store, records, successful, eOpts) {
            let counter = 0;
            store.getRootNode().cascadeBy(function() { counter++; });

            if (counter - 1 == 0) {
                Ext.getCmp('impexportbtn').setDisabled(true);
            } else {
                Ext.getCmp('impexportbtn').setDisabled(false);
            }
        }
    },
    proxy: {
        type: 'ajax',
        url: '',
        reader: {
            type: 'json'
        }
    }
});