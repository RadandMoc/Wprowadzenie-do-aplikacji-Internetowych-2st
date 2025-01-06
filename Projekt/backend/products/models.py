from django.db import models

# Create your models here.
class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=255)
    stock = models.PositiveIntegerField()
    image = models.ImageField(upload_to='products/images/', blank=True)

    def __str__(self):
        return self.name


class Review(models.Model):
    product = models.ForeignKey(Product, related_name='reviews', on_delete=models.CASCADE)
    username = models.CharField(max_length=255)
    comment = models.TextField()
    rating = models.PositiveSmallIntegerField()
    date = models.DateField()

    def __str__(self):
        return f"Review by {self.username} for {self.product.name}"