from django.db import models
from django.contrib.auth.models import User


class Font(models.Model):
    name = models.CharField(max_length=100, unique=False)
    style = models.CharField(max_length=50, blank=True)
    file = models.FileField(upload_to="fonts/", blank=True, null=True)
    
    class Meta:
            constraints = [
                models.UniqueConstraint(
                    fields=["name", "style"], name="unique_font"
                )
            ]

    def __str__(self):
        return f"{self.name} ({self.style})" if self.style else self.name


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


class DesignPlace(models.Model):
    viewName = models.CharField(max_length=30, null=True, unique=True)

    def __str__(self) -> str:
        return self.viewName.replace(" ", "-")


class ProductDesignPlace(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True)
    viewName = models.ForeignKey(DesignPlace, on_delete=models.CASCADE, null=True)
    x_start = models.DecimalField(decimal_places=5, max_digits=5, default=0)
    x_end = models.DecimalField(decimal_places=5, max_digits=5, default=0)
    y_start = models.DecimalField(decimal_places=5, max_digits=5, default=0)
    y_end = models.DecimalField(decimal_places=5, max_digits=5, default=0)

    _id = models.AutoField(
        primary_key=True, editable=False,
    )

    def __str__(self) -> str:
        return (
            str(self.product).replace(" ", "-")
            + "_"
            + str(self.viewName).replace(" ", "-")
        )


class ProductColorImage(models.Model):
    color = models.ForeignKey(ProductColor, on_delete=models.CASCADE, null=True)
    viewName = models.ForeignKey(
        ProductDesignPlace, on_delete=models.CASCADE, null=True
    )
    image = models.ImageField(null=True)
    _id = models.AutoField(primary_key=True, editable=False, default=None)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["color", "viewName"],
                name="unique_color_viewName",
            )
        ]

    def __str__(self) -> str:
        return (
            str(self.color).replace(" ", "-")
            + "_"
            + str(self.viewName).replace(" ", "-")
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
    design_Type = models.ForeignKey(
        DesignType, on_delete=models.SET_NULL, null=True, default=None
    )
    design_Category = models.ForeignKey(
        DesignCategory, on_delete=models.SET_NULL, null=True, default=None
    )
    _id = models.AutoField(primary_key=True, editable=False)
    name = models.CharField(max_length=200, null=True, blank=False)
    show = models.BooleanField(default=True)
    image = models.ImageField(null=True)

    def __str__(self) -> str:
        return self.name


class PickedDesign(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    user = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, default=None
    )
    design = models.ForeignKey(Design, on_delete=models.SET_NULL, null=True)


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
    _id = models.AutoField(
        primary_key=True,
        editable=False,
    )

    productColorSize = models.ForeignKey(
        ProductColorSize,
        on_delete=models.SET_NULL,
        null=True,
    )

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        null=True,
    )

    quantity = models.DecimalField(
        default=0,
        null=True,
        decimal_places=2,
        max_digits=7,
    )

    designSession = models.ForeignKey(
        "DesignSession",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
    )


class ProdDesign(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    orderItem = models.ForeignKey(OrderItem, null=True, on_delete=models.CASCADE)
    design = models.ForeignKey(PickedDesign, null=True, on_delete=models.SET_NULL)
    place = models.ForeignKey(DesignPlace, null=True, on_delete=models.SET_NULL)

    def __str__(self) -> str:
        return str(self.orderItem) + str(self.design) + str(self.place)


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


class DesignSession(models.Model):
    _id = models.AutoField(
        primary_key=True,
        editable=False,
    )

    owner = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    name = models.CharField(
        max_length=200,
        default="Untitled Design",
    )

    thumbnail = models.ImageField(
        upload_to="design_sessions/",
        null=True,
        blank=True,
    )

    designData = models.JSONField()

    isTemplate = models.BooleanField(
        default=False,
    )

    createdAt = models.DateTimeField(
        auto_now_add=True,
    )

    updatedAt = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return self.name


class CustomizedDesign(models.Model):

    SOURCE_TYPES = (
        ("catalog", "Catalog"),
        ("upload", "Upload"),
        ("text", "Text"),
    )

    _id = models.AutoField(
        primary_key=True,
        editable=False,
    )

    session = models.ForeignKey(
        DesignSession,
        on_delete=models.CASCADE,
        related_name="designs",
    )

    place = models.ForeignKey(
        DesignPlace,
        on_delete=models.SET_NULL,
        null=True,
    )

    sourceType = models.CharField(
        max_length=20,
        choices=SOURCE_TYPES,
        default="catalog",
    )

    sourceDesign = models.ForeignKey(
        Design,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    uploadedImage = models.ImageField(
        upload_to="uploaded_designs/",
        null=True,
        blank=True,
    )

    croppedImage = models.ImageField(
        upload_to="cropped_designs/",
        null=True,
        blank=True,
    )

    text = models.TextField(
        null=True,
        blank=True,
    )

    x = models.FloatField(default=0)
    y = models.FloatField(default=0)

    width = models.FloatField(default=0)
    height = models.FloatField(default=0)

    rotation = models.FloatField(default=0)

    horizontalFlip = models.BooleanField(
        default=False,
    )

    verticalFlip = models.BooleanField(
        default=False,
    )

    layer = models.IntegerField(
        default=1,
    )

    cropX = models.FloatField(default=0)
    cropY = models.FloatField(default=0)

    cropWidth = models.FloatField(default=1)
    cropHeight = models.FloatField(default=1)

    fontFamily = models.ForeignKey(
        Font,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    isBold = models.BooleanField(
        default=False,
    )

    isItalic = models.BooleanField(
        default=False,
    )

    textAlignment = models.CharField(
        max_length=20,
        default="center",
    )

    textShape = models.CharField(
        max_length=30,
        default="normal",
    )

    shapeIntensity = models.FloatField(
        default=0,
    )

    lineSpacing = models.FloatField(
        default=1,
    )

    designColor = models.ForeignKey(
        VinylColor,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="+",
    )

    outlineColor = models.ForeignKey(
        VinylColor,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="+",
    )

    outlineWidth = models.FloatField(
        default=0,
    )
