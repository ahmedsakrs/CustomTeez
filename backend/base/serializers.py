from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["image"]


class ProductColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductColor
        fields = ["_id", "color_Name", "color_RGB", "show"]


class ProductColorSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductColorSize
        fields = ["size", "countInStock"]


class ProductColorImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductColorImage
        fields = ["image", "viewName"]


class DesignCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = DesignCategory
        fields = "__all__"


class DesignSerializer(serializers.ModelSerializer):
    class Meta:
        model = Design
        fields = "__all__"


class DesignPlaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = DesignPlace
        fields = "__all__"


class ProductDesignPlaceSerializer(serializers.ModelSerializer):

    viewName = serializers.CharField(source="viewName.viewName")

    class Meta:
        model = ProductDesignPlace

        fields = [
            "viewName",
            "x_start",
            "x_end",
            "y_start",
            "y_end",
        ]


class ProductColorImageDetailedSerializer(serializers.ModelSerializer):
    viewName = serializers.CharField(source="viewName.viewName.viewName")

    image = serializers.SerializerMethodField()

    class Meta:
        model = ProductColorImage

        fields = [
            "viewName",
            "image",
        ]

    def get_image(self, obj):
        return obj.image.url


class DetailedProductColorSerializer(serializers.ModelSerializer):
    sizes = serializers.SerializerMethodField()

    viewImages = serializers.SerializerMethodField()

    class Meta:
        model = ProductColor

        fields = [
            "_id",
            "color_Name",
            "color_RGB",
            "sizes",
            "viewImages",
        ]

    def get_sizes(self, obj):
        result = {}

        sizes = ProductColorSize.objects.filter(productColor=obj)

        for size in sizes:
            result[size.size] = {
                "size": size.size,
                "countInStock": size.countInStock,
            }

        return result

    def get_viewImages(self, obj):

        result = {}

        images = ProductColorImage.objects.filter(color=obj).select_related(
            "viewName", "viewName__viewName"
        )

        for image in images:

            view_name = image.viewName.viewName.viewName

            result[view_name] = image.image.url if image.image else None

        return result


class ProductDesignerSerializer(serializers.ModelSerializer):

    colors = serializers.SerializerMethodField()

    regions = serializers.SerializerMethodField()

    images = serializers.SerializerMethodField()

    class Meta:
        model = Product

        fields = [
            "_id",
            "name",
            "description",
            "price",
            "material",
            "colors",
            "regions",
            "show",
            "images",
        ]

    def get_colors(self, obj):
        result = {}

        colors = ProductColor.objects.filter(
            product=obj,
            show=True,
        )

        for color in colors:
            result[color.color_Name] = DetailedProductColorSerializer(color).data

        return result

    def get_regions(self, obj):
        result = {}

        regions = ProductDesignPlace.objects.filter(product=obj)

        for region in regions:

            view_name = region.viewName.viewName

            result[view_name] = {
                "x_start": region.x_start,
                "x_end": region.x_end,
                "y_start": region.y_start,
                "y_end": region.y_end,
            }

        return result

    def get_images(self, obj):
        images = ProductImage.objects.filter(product=obj)

        return [image.image.url for image in images]


class DetailedDesignSerializer(serializers.ModelSerializer):

    design_Type = serializers.CharField(source="design_Type.name")

    design_Category = serializers.CharField(source="design_Category.name")

    image = serializers.SerializerMethodField()

    class Meta:
        model = Design

        fields = [
            "_id",
            "name",
            "image",
            "design_Type",
            "design_Category",
        ]

    def get_image(self, obj):
        return obj.image.url


class DesignerProductListSerializer(serializers.ModelSerializer):
    productColors = serializers.SerializerMethodField()
    viewImages = serializers.SerializerMethodField()
    viewRegions = serializers.SerializerMethodField()

    class Meta:
        model = Product

        fields = [
            "_id",
            "name",
            "description",
            "price",
            "material",
            "productColors",
            "viewImages",
            "viewRegions",
            "image",
        ]

    def get_productColors(self, product):

        result = {}

        colors = ProductColor.objects.filter(
            product=product,
            show=True,
        )

        for color in colors:

            result[color.color_Name] = {
                "color_Name": color.color_Name,
                "color_RGB": color.color_RGB,
            }

        return result

    def get_viewImages(self, product):

        result = {}

        for color in ProductColor.objects.filter(
            product=product,
            show=True,
        ):
            result[color.color_Name] = {}

            images = ProductColorImage.objects.filter(
                color=color,
            ).select_related(
                "viewName",
                "viewName__viewName",
            )

            for image in images:
                view_name = image.viewName.viewName.viewName

                result[color.color_Name][view_name] = (
                    image.image.url if image.image else None
                )

        return result

    def get_viewRegions(self, product):

        regions = {}

        places = ProductDesignPlace.objects.filter(
            product=product,
        ).select_related(
            "viewName",
        )

        for place in places:
            regions[place.viewName.viewName] = {
                "xStart": float(place.x_start),
                "xEnd": float(place.x_end),
                "yStart": float(place.y_start),
                "yEnd": float(place.y_end),
            }

        return regions


class FontSerializer(serializers.ModelSerializer):
    class Meta:
        model = Font
        fields = "__all__"