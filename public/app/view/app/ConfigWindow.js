Ext.define('PHNet.view.app.ConfigWindow', {
    extend: 'Ext.window.Window',
    id: 'configwindow',
    alias : 'widget.configwindow',
    autoShow: true,
    minWidth: 1100,
    minHeight: 540,
    resizable: false,
    maximizable: true,
    closable: true,
    title: 'Configuraci&oacute;n',
    layout: {
        type: 'vbox',    // Arrange child items vertically
        align: 'stretch'    // Each takes up full width
    },
    renderTo: Ext.getBody(),
    frame: true,
    listeners: {
        'destroy': function(window, opt) {
            localStorage.removeItem('phcp_win');
            localStorage.removeItem('phcp_win_id');
            $('.nav-icons li').removeClass('active');
            $('#lnk-home').addClass('active');
        },
        'maximize': function(window, opt) {
            Ext.getCmp('worksgrid').setHeight(this.height - 127);
            Ext.getCmp('metrotypegrid').setHeight(this.height - 127);
        },
        'restore': function(window, opt) {
            Ext.getCmp('worksgrid').setHeight(this.height - 127);
            Ext.getCmp('metrotypegrid').setHeight(this.height - 127);
        }
    },
 
    initComponent: function() {
        this.items = [{
            xtype: 'configtab'
        }];                        
        this.callParent(arguments);
    }
});