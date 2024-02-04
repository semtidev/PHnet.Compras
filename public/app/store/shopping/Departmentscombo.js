Ext.define('PHNet.store.shopping.Departmentscombo', {
	extend: 'Ext.data.Store',
    model: 'PHNet.model.Departments',
    autoLoad: true,
    proxy: {
        pageParam: false, //to remove param "page"
        startParam: false, //to remove param "start"
        limitParam: false, //to remove param "limit"
        noCache: false, //to remove param "_dc"
        type: 'ajax',
        url : '/phnet.compras/public/api/shopping/departments',
        reader: {
            type: 'json',
            root: 'departments',
            successProperty: 'success',
            messageProperty: 'message'
        },
        listeners: {
            exception: function(proxy, response, operation) {
                //console.log(response);
                Ext.MessageBox.show({
                    title: 'Mensaje del Sistema',
                    msg: 'Lo sentimos, ha ocurrido un error en el sistema durante su ejecución. Presione la tecla F5 de su teclado para que todo inicie nuevamente. Si el problema persiste póngase en contacto con el <a href="mailto:semti@nauta.cu">Administrador del Sistema</a>.',
                    icon: 'fas fa-exclamation-triangle fa-2x dlg-error',
                    buttons: Ext.Msg.OK
                });
            },
            load: function (store, records, successful, eOpts ) {
                store.sort('name', 'ASC');
            }
        }
    }
});