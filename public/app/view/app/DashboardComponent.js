Ext.define('PHNet.view.app.DashboardComponent', {
    extend: 'Ext.Component',
    id: 'dashboardcmp',
    alias : 'widget.dashboardcmp',
    padding: 0,
    margin: 0,
    html: '<iframe name="content_pages" id="iframe" width="100%" height="100%"" src="dashboard" frameborder="0" marginheight="0" marginwidth="0" scrolling="yes" style="overflow:auto;"></iframe>'
});