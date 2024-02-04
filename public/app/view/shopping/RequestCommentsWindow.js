Ext.define('PHNet.view.shopping.RequestCommentsWindow', {
    extend: 'Ext.window.Window',
    id: 'requestcommentswindow',
    alias: 'widget.requestcommentswindow',
    closable: true,
    resizable: false,
    width: 650,
    height: 400,
    layout: 'border',
    modal: true,
    tools: [{
        type: 'refresh',
        tooltip: 'Actualizar',
        callback: function() {
            var grid = Ext.getCmp('requestcommentsgrid');
            grid.getStore().load({
                callback: function(records, operation, success) {
                    grid.getSelectionModel().deselect(records, true);
                }
            });
        }
    }],
    renderTo: Ext.getBody(),
    initComponent: function() {
        this.items = [{
            xtype: 'requestcommentsgrid',
            layout: 'fit',
            region: 'center'
        }];
        this.callParent(arguments);
    }
});