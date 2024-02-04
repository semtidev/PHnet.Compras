Ext.define('PHNet.store.shopping.Requestproducts', {
	extend: 'Ext.data.Store',
    model: 'PHNet.model.shopping.Requestproduct',
    autoLoad: false,
    listeners: {
        load: function(store, records, successful, eOpts ) {
            let priceEl = Ext.get('shopp_request_total_price')
            if (store.count() > 1) {
                let total_price = store.getAt(store.count() - 1).data.total_price;                        
                priceEl.update('$' + total_price);
            }
            else {
                priceEl.update('$0.00');
            }
        }
    },
    proxy: {
        pageParam: false, //to remove param "page"
        startParam: false, //to remove param "start"
        limitParam: false, //to remove param "limit"
        noCache: false, //to remove param "_dc"
        type: 'ajax',
        reader: {
            type: 'json',
            root: 'products',
            successProperty: 'success',
            messageProperty: 'message'
        },
        listeners: {
            exception: function(proxy, response, operation) {
                Ext.MessageBox.show({
                    title: 'Mensaje del Sistema',
                    msg: 'Lo sentimos, ha ocurrido un error en el sistema durante su ejecución. Presione la tecla F5 de su teclado para que todo inicie nuevamente. Si el problema persiste póngase en contacto con el <a href="mailto:semti@nauta.cu">Administrador del Sistema</a>.',
                    icon: 'fas fa-exclamation-triangle fa-2x dlg-error',
                    buttons: Ext.Msg.OK
                });
            }
        }
    }
});