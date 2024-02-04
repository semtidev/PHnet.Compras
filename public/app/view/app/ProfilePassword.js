Ext.define('PHNet.view.app.ProfilePassword', {
    extend: 'Ext.window.Window',
    alias: 'widget.userpassword',
    id: 'userpassword',
    requires: [
        'Ext.form.*',
    ],
    layout: 'fit',
    autoShow: true,
    width: 300,
    resizable: false,
    modal: true,
    title: 'Cambiar Contrase&ntilde;a',
    initComponent: function() {
        this.items = [{
            xtype: 'form',
            padding: '5 20 20 20',
            style: 'background: #fff url(dist/img/profile-bg.jpg) repeat-x;',

            fieldDefaults: {
                anchor: '100%',
                labelAlign: 'left',
                style: 'background: transparent;',
                margin: '10 0 10 0',
                combineErrors: true,
                msgTarget: 'side'
            },
            items: [{
                    xtype: 'textfield',
                    name: 'exportto',
                    hidden: true
                }, {
                    xtype: 'component',
                    width: 240,
                    cls: 'profile-name',
                    html: localStorage.getItem('phcp_un'),
                    margin: '15 0 10 0'
                }, {
                    xtype: 'component',
                    cls: 'profile-avatar',
                    style: 'background: url(/phnet.compras/public/dist/img/users/' + localStorage.getItem('phcp_up') + '.jpg) center'
                },
                {
                    xtype: 'component',
                    width: 240,
                    cls: 'profile-rol',
                    html: localStorage.getItem('phcp_upn')
                },
                {
                    xtype: 'textfield',
                    id: 'old_pass',
                    inputType: 'password',
                    allowBlank: false,
                    flex: 1,
                    margin: '20 3 10 3',
                    name: 'old_pass',
                    emptyText: 'Contraseña Anterior',
                    afterLabelTextTpl: '<span style="color:red;font-weight:bold" data-qtip="Required"> *</span>'
                }, {
                    xtype: 'textfield',
                    id: 'new_pass',
                    inputType: 'password',
                    allowBlank: false,
                    flex: 1,
                    margin: '10 3 10 3',
                    name: 'new_pass',
                    emptyText: 'Nueva Contraseña',
                    afterLabelTextTpl: '<span style="color:red;font-weight:bold" data-qtip="Required"> *</span>'
                }, {
                    xtype: 'textfield',
                    id: 'rep_pass',
                    inputType: 'password',
                    allowBlank: false,
                    flex: 1,
                    margin: '10 3 10 3',
                    name: 'rep_pass',
                    emptyText: 'Repetir Contraseña',
                    afterLabelTextTpl: '<span style="color:red;font-weight:bold" data-qtip="Required"> *</span>'
                }, {
                    xtype: 'button',
                    text: 'Cambiar Contrase\xF1a',
                    cls: 'x-btn-button app-form-btn',
                    scale: 'medium',
                    action: 'btn-changepass',
                    margin: '10 3 10 3'
                }
            ]
        }];

        this.callParent(arguments);
    }
});