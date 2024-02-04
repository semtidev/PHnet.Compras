Ext.define('PHNet.view.app.ConfigTab', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.configtab',
    id: 'configtab',
    frame:false,
    layout: 'fit',
    requires: [
        'Ext.tab.*',
        'Ext.tip.QuickTipManager',
        'PHNet.view.app.WorksGrid'
    ],
    activeTab: 0,
    items: [
        {
            title: 'Obras/Comedores',
            xtype: 'worksgrid',
            itemId: 'workstab',
            bodyPadding: 0
        }
    ],
    initComponent: function() {

        this.dockedItems = [{
            xtype: 'toolbar',
            id: 'workstoolbar',
            cls: 'toolbar',
            height: 50,
            items: [{
                iconCls: 'fas fa-sync-alt icon-blue',
                cls: 'toolbar_button',
                text: '',
                tooltip: 'Recargar Listado',
                margin: '2 8 2 4',
                action: 'reload'
            }]
        }];

        this.callParent(arguments);
    }
});