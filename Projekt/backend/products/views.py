from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Product, Review, Order, User
from .serializers import ProductSerializer

class ProductList(APIView):
    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

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
