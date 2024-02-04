Ext.define('PHNet.view.tracking.TrackingImpWindow', {
    extend: 'Ext.window.Window',
    id: 'trackingimpwindow',
    alias: 'widget.trackingimpwindow',
    autoShow: true,
    autoScroll: true,
    minWidth: 1200,
    minHeight: 540,
    resizable: false,
    maximizable: true,
    closable: true,
    title: '<i class="fas fa-globe fa-sm"></i>&nbsp;&nbsp;Seguimiento a Compras de Importaci\xF3n',
    layout: {
        type: 'border', // Arrange child items vertically
        align: 'stretch', // Each takes up full width
        autoScroll: true,
    },
    renderTo: Ext.getBody(),
    frame: true,
    listeners: {
        'destroy': function(window, opt) {
            localStorage.removeItem('phcp_win');
            localStorage.removeItem('phcp_win_id');
            localStorage.removeItem('tracking_filter');
            $('#dropdown-shopping').removeClass('focus');
            $('#lnk-home').addClass('active');
        }
    },

    initComponent: function() {
        this.items = [{
            region: 'center',
            id: 'trackingimp-main-content',
            layout: {
                type: 'vbox',
                padding: '0',
                align: 'stretch'
            },
            bodyStyle: {
                "background-color": "#056BCA"
            },
            items: [{
                xtype: 'trackingimpgrid',
                flex: 1
            }]
        }];

        this.callParent(arguments);
    }
});