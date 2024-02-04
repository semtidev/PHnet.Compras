Ext.define('PHNet.view.app.ProfileWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.userprofile',
    id: 'userprofile',
    requires: [
        'Ext.form.*',
    ],
    layout: 'fit',
    autoShow: true,
    width: 300,
    resizable: false,
    modal: true,
    title: 'Perfil de Usuario',
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
                    xtype: 'component',
                    width: 240,
                    cls: 'profile-notify',
                    html: 'Recibir Notificaciones por Correo:'
                }, {
                    xtype: 'checkboxfield',
                    id: 'notify_metrology',
                    boxLabel: 'Solicitudes de Compras',
                    name: 'shoppingrequest',
                    disabled: true,
                    checked: true,
                    margin: '0 0 5 40'
                }, {
                    xtype: 'checkboxfield',
                    id: 'notify_normalization',
                    boxLabel: 'Seguimiento de Compras',
                    name: 'shoppingtracking',
                    disabled: true,
                    checked: true,
                    margin: '0 0 5 40'
                }
            ]
        }];

        this.callParent(arguments);
    }
});