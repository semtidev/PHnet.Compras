Ext.define('PHNet.view.shopping.RequestsWindow', {
    extend: 'Ext.window.Window',
    id: 'requestswindow',
    alias : 'widget.requestswindow',
    autoShow: true,
    minWidth: 1200,
    minHeight: 540,
    resizable: false,
    maximizable: true,
    closable: true,
    tools: [{
        type: 'refresh',
        tooltip: 'Recargar Listado de Solicitudes',
        handler: function(event, toolEl, panelHeader) {
			let window = Ext.getCmp('requestswindow');
			window.fireEvent('clearDetails');
		}
    }],
    title: '<i class="fas fa-shopping-cart fa-sm"></i>&nbsp;&nbsp;Solicitudes de Compra',
    layout: {
        type: 'border',    // Arrange child items vertically
        align: 'stretch'    // Each takes up full width
    },
    renderTo: Ext.getBody(),
    frame: true,
    listeners: {
        'destroy': function(window, opt) {
            localStorage.removeItem('phcp_win');
            localStorage.removeItem('phcp_win_id');
            $('#dropdown-shopping').removeClass('focus');
            $('#lnk-home').addClass('active');
        },
        /*'maximize': function(window, opt) {
            Ext.getCmp('worksgrid').setHeight(this.height - 127);
            Ext.getCmp('metrotypegrid').setHeight(this.height - 127);
        },
        'restore': function(window, opt) {
            Ext.getCmp('worksgrid').setHeight(this.height - 127);
            Ext.getCmp('metrotypegrid').setHeight(this.height - 127);
        }*/
    },
 
    initComponent: function() {
        this.items = [
            {
                id: 'chronogram-panel',
                region: 'east',
                autoScroll: true,
                title: 'Cronograma de Suministros',
                headerPosition: 'bottom',
                split:false,
                width: 234,
                minWidth: 234,
                collapsible: true,
                bodyStyle: {
                    "background-color": "#D5E9F4"
                },
                html: '<p class="help-description"><i class="fas fa-info-circle"></i><br>Cuando seleccione una Solicitud de Compra, el <strong>Cronograma de Suministros</strong> se mostrar\xE1 aqu\xED.</p>'
            }, {
                region: 'center',
                id: 'shopp-main-content',
                layout: {
                    type: 'vbox',
                    padding: '0 5 0 0',
                    align: 'stretch'
                },
                bodyStyle: {
                    "background-color": "#056BCA"
                },
                items:[{
                    xtype: 'shopprequeststab',
                    flex:1
                },
                Ext.create('PHNet.view.shopping.ShoppProductsHelp')
            ]
            }
        ];

        this.callParent(arguments);
    }
});