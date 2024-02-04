Ext.define('PHNet.view.app.DashboardWindow', {
    extend: 'Ext.window.Window',
    id: 'dashboardwindow',
    alias : 'widget.dashboardwindow',
    requires: [
        'PHNet.view.app.DashboardComponent'
    ],
    autoShow: true,
    autoScroll: true,
    minWidth: 1200,
    minHeight: 540,
    resizable: false,
    maximizable: true,
    closable: true,
    title: '<i class="fas fa-chart-bar fa-sm"></i>&nbsp;&nbsp;Cuadro de Mando Integral',
    layout: {
        type: 'border',    // Arrange child items vertically
        align: 'stretch',    // Each takes up full width
        autoScroll: true
    },
    renderTo: Ext.getBody(),
    frame: true,
    listeners: {
        'render': function( window, eOpts ) {
            console.log(window.getPosition());
        },
        'destroy': function(window, opt) {
            localStorage.removeItem('phcp_win');
            localStorage.removeItem('phcp_win_id');
            $('.nav-icons li').removeClass('active');
            $('.nav-icons li').removeClass('focus');
            $('#lnk-home').addClass('active');
        }
    },
 
    initComponent: function() {
        this.items = [
            {
                region: 'center',
                id: 'trackingnat-main-content',
                layout: {
                    type: 'vbox',
                    padding: '0',
                    align: 'stretch'
                },
                bodyStyle: {
                    "background-color": "#f4f4f4"
                },
                items:[{
                    xtype: 'dashboardcmp',
                    flex:1
                }]
            }
        ];

        this.callParent(arguments);
    }
});