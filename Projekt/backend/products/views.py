from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Product, Review, Order
from .serializers import ProductSerializer,UserSerializer
from rest_framework import status,generics
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.authentication import TokenAuthentication
from django.contrib.auth.models import User

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key})
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

class UserDetailView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'id': user.id,
            'username': user.username,
            'is_superuser': user.is_superuser,
        })
    
class ProductList(APIView):
    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

class ProductDetail(APIView):
    def get(self, request, product_id):
        try:
            product = Product.objects.prefetch_related('reviews').get(id=product_id)
            serializer = ProductSerializer(product)
            return Response(serializer.data)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=404)
        
class UserOrders(APIView):
    def get(self, request, user_id):
        orders = Order.objects.filter(user_id=user_id)
        orders_data = [{"product": order.product.name, "quantity": order.quantity, "order_date": order.order_date} for order in orders]
        return Response(orders_data)

class ProductReviews(APIView):
    def get(self, request, product_id):
        reviews = Review.objects.filter(product_id=product_id)
        reviews_data = [{"username": review.username, "comment": review.comment, "rating": review.rating, "date": review.date} for review in reviews]
        return Response(reviews_data)

class AddReview(APIView):
    def post(self, request):
        product_id = request.data.get('product_id')
        username = request.data.get('username')
        comment = request.data.get('comment')
        rating = request.data.get('rating')
        date = request.data.get('date')
        product = Product.objects.get(id=product_id)
        new_review = Review.objects.create(product=product, username=username, comment=comment, rating=rating, date=date)
        return Response({"message": "Review added successfully", "review": str(new_review)})

class AddProduct(APIView):
    def post(self, request):
        if not request.user.is_superuser:
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        name = request.data.get('name')
        description = request.data.get('description')
        price = request.data.get('price')
        category = request.data.get('category')
        stock = request.data.get('stock')
        image = request.data.get('image')
        new_product = Product.objects.create(name=name, description=description, price=price, category=category, stock=stock, image=image)
        return Response({"message": "Product added successfully", "product": str(new_product)})

class UpdateProduct(APIView):
    def post(self, request, product_id):
        if not request.user.is_superuser:
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        product = Product.objects.get(id=product_id)
        product.name = request.data.get('name', product.name)
        product.description = request.data.get('description', product.description)
        product.price = request.data.get('price', product.price)
        product.category = request.data.get('category', product.category)
        product.stock = request.data.get('stock', product.stock)
        product.image = request.data.get('image', product.image)
        product.save()
        return Response({"message": "Product updated successfully", "product": str(product)})

class DecreaseProductStock(APIView):
    def post(self, request, product_id):
        product = Product.objects.get(id=product_id)
        decrease_amount = int(request.data.get('decrease_amount', 0))
        product.stock -= decrease_amount
        product.save()
        return Response({"message": "Product stock decreased successfully", "product": str(product)})

class AddOrder(APIView):
    def post(self, request):
        user_id = request.data.get('user_id')
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity')
        user = User.objects.get(id=user_id)
        product = Product.objects.get(id=product_id)
        new_order = Order.objects.create(user=user, product=product, quantity=quantity)
        return Response({"message": "Order added successfully", "order": str(new_order)})
