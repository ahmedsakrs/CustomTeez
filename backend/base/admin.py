from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Product)
admin.site.register(DesignType)
admin.site.register(Design)
admin.site.register(ProductColor)
admin.site.register(ProductColorSize)
admin.site.register(ProductImage)
admin.site.register(ProductColorImage)
admin.site.register(ProductDesignPlace)
admin.site.register(VinylColor)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(ProdDesign)
admin.site.register(ShippingAddress)
admin.site.register(DesignCategory)