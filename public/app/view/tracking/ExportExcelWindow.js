Ext.define('PHNet.view.tracking.ExportExcelWindow', {
    extend: 'Ext.window.Window',
    id: 'exportexcelwindow',
    alias : 'widget.exportexcelwindow',
    resizable: false,
    width: 430,
    height: 250,
    maximizable: false,
    closable: true,
    layout: 'fit',
    modal: true,
    title: 'Exportar a Libro de Excel...',
    renderTo: Ext.getBody(),
    initComponent: function() {
        this.items = [{
        	xtype: 'form',
            padding: 0,
            margin: 0,
            border: false,
            padding: '20 20 15 20',
            waitMsgTarget: true,
            style: 'background-color: #f2f8fc;',
            fieldDefaults: {
            	anchor: '100%',
                labelAlign: 'top'
            },
            items: [
                {
                    xtype: 'textfield',
                    id: 'export-excel-type',
                    name: 'type',
                    hidden: true
                }, {
                    xtype: 'container',
                    layout: {
                        type: 'hbox'
                    },
                    anchor: '100%',
                    region: 'center',
                    height: 53,
                    margin: 0,
                    padding: 0,
                    items: [{
                        xtype: 'component',
                        html: '<i class="fas fa-file-excel icon_green fa-3x"></i>',
                        width: 45
                    }, {
                        xtype: 'component',
                        html: 'Por favor, introduzca el T\xEDtulo del Libro de Excel que ser\xE1 generado, para completar la operaci\xF3n.',
                        style: {color:'#333'},
                        flex: 1
                    }]
                },
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox'
                    },
                    region: 'south',
                    height: 70,
                    margin: 0,
                    padding: 0,
                    items: [{
                        xtype: 'textfield',
                        id: 'export-excel-title',
                        name: 'title',
                        allowBlank: false,
                        fieldLabel: 'T\xEDtulo',
                        emptyText: 'Ej.: Solicitudes de Compras Nacionales 1er Trimestre',
                        flex: 1,
                        margin: '3 3 3 3',
                        afterLabelTextTpl: '<span style="color:red;font-weight:bold" data-qtip="Required"> *</span>',
                        listeners: {
                            specialkey: function(field, e){
                                if (e.getKey() == e.ENTER) {
                                    Ext.getCmp('exportExcelform-okbutton').fireEvent('click', Ext.getCmp('exportExcelform-okbutton'));
                                }
                            }
                        }
                    }]
                }
            ]
        }];

        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'bottom',
            id: 'buttons',
            ui: 'footer',
            items: ['->', {
                text: '<i class="fas fa-check"></i>&nbsp;Aceptar',
                id: 'exportExcelform-okbutton',
                cls: 'app-form-btn',
                scale: 'medium',
                margin: '3 0 3 0',
                action: 'export'
            }, {
                text: '<i class="fas fa-times"></i>&nbsp;Cancelar',
                cls: 'app-form-btn',
                scale: 'medium',
                margin: '3 15 3 5',
                scope: this,
                handler: this.close
            }]
        }];

        this.callParent(arguments);
    }
});