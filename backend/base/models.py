from django.db import models
from django.contrib.auth.models import User


class Product(models.Model):
    name = models.CharField(unique=True, max_length=200, null=True, blank=False)
    description = models.TextField(null=True, blank=True)
    price = models.DecimalField(max_digits=7, decimal_places=2, default=0)
    image = models.ImageField(null=True)
    material = models.CharField(max_length=50, null=True)
    _id = models.AutoField(primary_key=True, editable=False)
    show = models.BooleanField(default=True)

    def __str__(self) -> str:
        return self.name


class ProductColor(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True)
    color_Name = models.CharField(max_length=30, null=True)
    color_RGB = models.CharField(max_length=7, null=True)
    _id = models.AutoField(primary_key=True, editable=False)
    show = models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["product", "color_Name"], name="unique_product_color"
            )
        ]

    def __str__(self) -> str:
        return (
            str(self.product).replace(" ", "-")
            + "_"
            + self.color_Name.replace(" ", "-")
        )


class ProductColorSize(models.Model):
    productColor = models.ForeignKey(ProductColor, on_delete=models.CASCADE, null=True)
    size = models.CharField(max_length=15, null=True)
    _id = models.AutoField(primary_key=True, editable=False)
    countInStock = models.DecimalField(max_digits=7, decimal_places=0, default=0)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["productColor", "size"], name="unique_productColor_size"
            )
        ]

    def __str__(self) -> str:
        return str(self.productColor) + "_" + self.size.replace(" ", "-")


class ProductDesignPlace(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True)
    x_start = models.DecimalField(decimal_places=5, max_digits=5, default=0)
    y_start = models.DecimalField(decimal_places=5, max_digits=5, default=0)
    x_end = models.DecimalField(decimal_places=5, max_digits=5, default=0)
    y_end = models.DecimalField(decimal_places=5, max_digits=5, default=0)
    viewName = models.CharField(max_length=50, null=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["product", "viewName"], name="unique_product_viewName"
            )
        ]

    def __str__(self) -> str:
        return (
            str(self.product).replace(" ", "-") + "_" + self.viewName.replace(" ", "-")
        )


class ProductColorImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True)
    color = models.ForeignKey(ProductColor, on_delete=models.CASCADE, null=True)
    image = models.ImageField(null=True, unique=True)
    designPlace = models.ForeignKey(
        ProductDesignPlace, on_delete=models.SET_NULL, null=True,blank=True
    )
    _id = models.AutoField(primary_key=True, editable=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["color", "designPlace"], name="unique_color_designPlace"
            )
        ]

    def __str__(self) -> str:
        return (
            str(self.color).replace(" ", "-") + "_" + self.designPlace.replace(" ", "-") if self.designPlace else str(self.color).replace(" ", "-")
        )


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True)
    image = models.ImageField(unique=True, null=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self) -> str:
        return str(self.product).replace(" ", "-") + "_" + str(self._id)


class DesignType(models.Model):
    name = models.CharField(max_length=200, default=None, primary_key=True)
    description = models.TextField(null=True)

    def __str__(self) -> str:
        return self.name


class DesignCategory(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    name = models.CharField(max_length=200, default=None)
    image = models.ImageField(null=True)
    show = models.BooleanField(default=True)

    def __str__(self) -> str:
        return self.name


class VinylColor(models.Model):
    name = models.CharField(max_length=200, primary_key=True)
    rgb_Code = models.CharField(max_length=7, null=True, blank=False)
    show = models.BooleanField(default=True)
    is_available = models.BooleanField(default=True)

    def __str__(self) -> str:
        return self.name


class Design(models.Model):
    design_Type = models.ForeignKey(DesignType, on_delete=models.CASCADE, null=True)
    design_Category = models.ForeignKey(
        DesignCategory, on_delete=models.CASCADE, null=True
    )
    _id = models.AutoField(primary_key=True, editable=False)
    name = models.CharField(max_length=200, null=True, blank=False)
    show = models.BooleanField(default=True)
    image = models.ImageField(null=True)

    def __str__(self) -> str:
        return self.name


class DesignComponent(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    image = models.ImageField(null=True)
    component_color = models.ForeignKey(
        VinylColor, on_delete=models.SET_NULL, null=True
    )
    width = models.DecimalField(decimal_places=5, max_digits=5, default=0)
    height = models.DecimalField(decimal_places=5, max_digits=5, default=0)
    center_x = models.DecimalField(decimal_places=5, max_digits=5, default=0)
    center_y = models.DecimalField(decimal_places=5, max_digits=5, default=0)
    is_color_changeable = models.BooleanField(default=True)
    design = models.ForeignKey(Design, on_delete=models.CASCADE, null=True)


class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    paymentMethod = models.CharField(max_length=40, null=True)
    taxPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True)
    shippingPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True)
    totalPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    isReady = models.BooleanField(default=False)
    readyAt = models.DateTimeField(auto_now_add=False, null=True)
    isShipped = models.BooleanField(default=False)
    shippedAt = models.DateTimeField(auto_now_add=False, null=True)
    isDelivered = models.BooleanField(default=False)
    deliveredAt = models.DateTimeField(auto_now_add=False, null=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self) -> str:
        return str(self.createdAt)


class OrderItem(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    productColorSize = models.ForeignKey(
        ProductColorSize, on_delete=models.SET_NULL, null=True
    )
    order = models.ForeignKey(Order, on_delete=models.CASCADE, null=True)
    quantity = models.DecimalField(default=0, null=True, decimal_places=2, max_digits=7)

    def __str__(self) -> str:
        return str(self._id)


class ProdDesign(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    orderItem = models.ForeignKey(OrderItem, null=True, on_delete=models.CASCADE)
    design = models.ImageField(null=True)
    place = models.ForeignKey(ProductDesignPlace, null=True, on_delete=models.SET_NULL)


class ShippingAddress(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, null=True)
    address = models.CharField(max_length=200, null=True)
    city = models.CharField(max_length=50, null=True)
    zip_code = models.CharField(max_length=10, null=True)
    state = models.CharField(max_length=50, null=True)
    shippingPrice = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, default=0
    )
    emailAddress = models.CharField(max_length=50, null=True)
    phoneNo = models.CharField(max_length=20, null=True, blank=True)
    _id = models.AutoField(primary_key=True, editable=False)
