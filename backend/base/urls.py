from django.urls import path
from . import views

urlpatterns = [
    path('', views.getRoutes, name='Routes'),
    path('products/', views.getProducts, name='products'),
    path('products/<str:pk>/', views.getProduct, name='product'),
    
    path('designCategories/', views.getDesignCategories, name='categories'),
    path('designCategories/<str:category>/', views.getDesignCategory, name='category'),
    path('designs/<str:id>/', views.getDesign, name='design'),
]