"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from products.views import ProductList, UserOrders, ProductReviews, AddReview, AddProduct, UpdateProduct, DecreaseProductStock, AddOrder,ProductDetail,LoginView,UserDetailView,RegisterView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('products/', ProductList.as_view(), name='product-list'),
    path('products/<int:product_id>/', ProductDetail.as_view(), name='product-detail'),
    path('user/<int:user_id>/orders/', UserOrders.as_view(), name='user-orders'),
    path('product/<int:product_id>/reviews/', ProductReviews.as_view(), name='product-reviews'),
    path('review/add/', AddReview.as_view(), name='add-review'),
    path('product/add/', AddProduct.as_view(), name='add-product'),
    path('product/<int:product_id>/update/', UpdateProduct.as_view(), name='update-product'),
    path('product/<int:product_id>/decrease-stock/', DecreaseProductStock.as_view(), name='decrease-product-stock'),
    path('order/addAll/', AddOrder.as_view(), name='add-order'),
    path('login/', LoginView.as_view(), name='login'),
    path('user/', UserDetailView.as_view(), name='user-detail'),
    path('register/', RegisterView.as_view(), name='register'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
