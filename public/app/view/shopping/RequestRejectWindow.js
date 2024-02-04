Ext.define('PHNet.view.shopping.RequestRejectWindow', {
    extend: 'Ext.window.Window',
    id: 'requestrejectwindow',
    alias: 'widget.requestrejectwindow',
    resizable: false,
    width: 530,
    height: 360,
    maximizable: false,
    closable: true,
    layout: 'fit',
    modal: true,
    renderTo: Ext.getBody(),
    initComponent: function() {
        this.items = [{
            xtype: 'form',
            padding: 0,
            margin: 0,
            padding: '20 20 15 20',
            border: false,
            waitMsgTarget: true,
            style: 'background-color: #f2f8fc;',
            fieldDefaults: {
                anchor: '100%',
                labelAlign: 'top'
            },
            items: [{
                    xtype: 'textfield',
                    id: 'request-reject-id',
                    name: 'request_reject_id',
                    hidden: true
                }, {
                    xtype: 'textfield',
                    id: 'request-reject-user',
                    name: 'request_reject_user',
                    hidden: true
                }, {
                    xtype: 'container',
                    layout: {
                        type: 'hbox'
                    },
                    anchor: '100%',
                    region: 'center',
                    height: 60,
                    margin: 0,
                    padding: 0,
                    items: [{
                        xtype: 'component',
                        html: '<i class="fas fa-shopping-cart text-red fa-3x"></i>',
                        width: 60
                    }, {
                        xtype: 'component',
                        html: 'Esta Solicitud de Compra ser\xE1 <strong>Rechazada</strong>, lo cual indica, que usted ha revisado los modelos asociados. Por favor, debe <strong>Comentar la Causa</strong> para completar la operaci\xF3n.',
                        style: { color: '#333' },
                        flex: 1
                    }]
                },
                {
                    xtype: 'container',
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    region: 'south',
                    height: 270,
                    margin: 0,
                    padding: 0,
                    items: [{
                        xtype: 'textareafield',
                        height: 140,
                        id: 'request-reject-comment',
                        allowBlank: false,
                        margin: '10 3 5 3',
                        name: 'comment',
                        fieldLabel: '<strong>Causa</strong>',
                        afterLabelTextTpl: '<span style="color:red;font-weight:bold" data-qtip="Required"> *</span>'
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
                cls: 'app-form-btn',
                scale: 'medium',
                margin: '3 0 3 0',
                action: 'reject'
            }, {
                text: '<i class="fas fa-times"></i>&nbsp;Cancelar',
                id: 'rejectform-cancelbutton',
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