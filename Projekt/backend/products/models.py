from django.db import models
from django.contrib.auth.models import User  # Import domyślnego modelu User

# Create your models here.

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=255)
    stock = models.PositiveIntegerField()
    image = models.ImageField(upload_to='media/images/', blank=True)

    def __str__(self):
        return self.name


class Review(models.Model):
    product = models.ForeignKey(Product, related_name='reviews', on_delete=models.CASCADE)
    username = models.CharField(max_length=255)
    comment = models.TextField()
    rating = models.PositiveSmallIntegerField()
    date = models.DateField()

    class Meta:
        unique_together = ('product', 'username')
        
    def __str__(self):
        return f"Review by {self.username} for {self.product.name}"
    
class Order(models.Model):
    user = models.ForeignKey(User, related_name='orders', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name='orders', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    order_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order of {self.quantity} {self.product.name} by {self.user.username}"