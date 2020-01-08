# Buildsheet_Automation/app/urls.py

from django.conf.urls import url
from app import views,uniqueEntity,patientValidation
from app.redshift import datacompletion

urlpatterns = [
    # url(r'^$', views.LoginPageView, name='login'), # Notice the URL has been named
    # url(r'^signup/$', views.SignupPageView, name='signup'),
    # url(r'^dashboard/$', views.SignupPageView, name='dashboard'),
    url(r'^create/$', views.BuidsheetOptions, name='create'),
    url(r'^buildsheetSubmit/$', views.BuildsheetSubmit, name='buildsheet'),
    url(r'^buildsheets/$', views.BuildsheetUtils, name='buildsheet'),
    url(r'^buildsheets/(?P<buildsheet_id>\d+)$', views.BuildsheetRedirect, name='buildsheet'),
    url(r'^buildsheets/(?P<buildsheet_id>\d+)/create/$', views.CategoryCreate, name='buildsheet'),
    url(r'^buildsheets/(?P<buildsheet_id>\d+)/update/(?P<meta_id>\d+)/$', views.CategoryUpdate, name='buildsheet'),
    url(r'^downloadBuildsheet/$', views.downloadBuildsheet, name='buildsheet'),
    url(r'^buildsheets/(?P<meta_id>\d+)/update/$', views.updateBuildsheet, name='buildsheet'),
    url(r'^getReport/$', views.getReport, name='buildsheet'),
    url(r'^buildsheetDelete/$', views.buildsheetDelete, name='buildsheet'),
    url(r'^dataCompletion/$', datacompletion.dataCompletion, name='dataCompletion'),
    url(r'^downloadDataReport/$', datacompletion.createExcelforClaims, name='dataCompletion'),
    url(r'^auditListing/$', views.getAuditReport, name='auditListing'),
    url(r'^auditListing/view/(?P<buildsheet_id>\d+)$', views.viewAuditReport, name='auditListing'),
    #url(r'^auditListing/(?P<meta_id>\d+)/viewo/$', views.viewontologyReport, name='auditListing'),
    url(r'^viewsemantic/(?P<meta_id>\d+)/view/$', views.viewsemanticReport, name='create-list'),
    url(r'^auditListing/(?P<meta_id>\d+)/view/$', views.viewCategoryAuditReport, name='auditListing'),
    url(r'^auditListing/(?P<meta_id>\d+)/views/$', views.viewsemanticReport, name='auditListing'),
    url(r'^auditListing/(?P<aco_id>\d+)/(?P<source_id>\d+)/view/$', views.allBuildsheetReport, name='auditListing'),
    url(r'^auditListing/(?P<aco_id>\d+)/(?P<source_id>\d+)/viewos/$', views.allonseReport, name='auditListing'),
    url(r'^uniqueEntity/$', uniqueEntity.getResult, name='uniqueEntity'),
    url(r'^uniqueEntity/(?P<buildsheet_id>\d+)$', uniqueEntity.uniqueRedirect, name='uniqueEntity'),
    url(r'^loadData/$', views.loadData, name='loadData'),
    url(r'^loadQuality/$', views.loadQuality, name='loadQuality'),
    url(r'^templates/$', views.templatesUtils, name='templatesUtils'),
    url(r'^valueLevers/$', views.valueLevers, name='buildsheet'),
    url(r'^patientValidation/$', patientValidation.runValidation, name='buildsheet'),
    url(r'^testcase/(?P<meta_id>\d+)/$', views.testCaseReport, name='testCaseReport'),

    # url(r'^auditReport/$', views.auditReport, name='auditListing')
]