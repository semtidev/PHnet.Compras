Ext.define('PHNet.view.tracking.RequestCancelWindow', {
    extend: 'Ext.window.Window',
    id: 'requestcancelwindow',
    alias: 'widget.requestcancelwindow',
    resizable: false,
    width: 530,
    height: 340,
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
                id: 'request-cancel-id',
                name: 'request_cancel_id',
                hidden: true
            }, {
                xtype: 'textfield',
                id: 'request-cancel-user',
                name: 'request_cancel_user',
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
                    html: '<i class="fas fa-info-circle icon_darkblue fa-2x"></i>',
                    width: 40
                }, {
                    xtype: 'component',
                    html: 'Por favor, comente las razones por las que esta Solicitud de Compra ser\xE1 Cancelada, para su notificai\xF3n v\xEDa correo electr\xF3nico.',
                    style: { color: '#333' },
                    flex: 1
                }]
            }, {
                xtype: 'textareafield',
                height: 140,
                id: 'request-cancel-comment',
                allowBlank: false,
                margin: '0 3 5 3',
                name: 'comment',
                fieldLabel: 'Comentario',
                afterLabelTextTpl: '<span style="color:red;font-weight:bold" data-qtip="Required"> *</span>'
            }]
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
                action: 'cancel'
            }, {
                text: '<i class="fas fa-times"></i>&nbsp;Cancelar',
                id: 'rcancelform-cancelbutton',
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