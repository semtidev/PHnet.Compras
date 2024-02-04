Ext.define('PHNet.view.shopping.RequestCommentWindow', {
    extend: 'Ext.window.Window',
    id: 'requestcommentwindow',
    alias: 'widget.requestcommentwindow',
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
                id: 'request-comment-id',
                name: 'request_comment_id',
                hidden: true
            }, {
                xtype: 'textfield',
                id: 'request-comment-user',
                name: 'request_comment_user',
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
                    width: 40,
                    margin: '5 0 0 0'
                }, {
                    xtype: 'component',
                    html: 'Este Comentario ser\xE1 notificado v\xEDa correo electr\xF3nico a todos los usuarios implicados en esta solicitud.',
                    style: { color: '#333' },
                    flex: 1
                }]
            }, {
                xtype: 'textareafield',
                height: 140,
                id: 'request-comment',
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
                action: 'comment'
            }, {
                text: '<i class="fas fa-times"></i>&nbsp;Cancelar',
                id: 'rcommentform-cancelbutton',
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