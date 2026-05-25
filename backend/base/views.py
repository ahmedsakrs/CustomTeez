from django.shortcuts import render
from .products import products
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models.query import QuerySet

from .serializers import *
from .models import *


@api_view(["GET"])
def getRoutes(request):
    return Response("someText")


@api_view(["GET"])
def getProducts(request):
    products = Product.objects.filter(show=True)
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def getProduct(request, pk):
    product = Product.objects.get(_id=pk, show=True)
    prod_serializer = ProductSerializer(product, many=False)

    colors = ProductColor.objects.filter(product=pk, show=True)
    colors_serializer = ProductColorSerializer(colors, many=True)

    images = ProductImage.objects.filter(product=pk)
    images_serializer = ProductImageSerializer(images, many=True)

    data = {}
    for key, val in prod_serializer.data.items():
        data[key] = val

    data["images"] = [list(image.values())[0] for image in images_serializer.data]
    colors_data = {}

    for color in colors_serializer.data:
        prod_color_id = color["_id"]
        color_name = color["color_Name"]
        color_rgb = color["color_RGB"]
        show = color["show"]
        if show:
            colors_data[color_name] = {"color_RGB": color_rgb, "show": show}

            color_sizes = ProductColorSize.objects.filter(productColor=prod_color_id)
            color_sizes_serializer = ProductColorSizeSerializer(color_sizes, many=True)

            colors_data[color_name]["sizes"] = {}

            for prod_color_size in color_sizes_serializer.data:
                size_name = prod_color_size["size"]
                colors_data[color_name]["sizes"][size_name] = {
                    "availableInStock": int(prod_color_size["countInStock"]) > 0
                }

            color_images = ProductColorImage.objects.filter(
                product=pk, color=prod_color_id
            )
            color_images_serializer = ProductColorImageSerializer(
                color_images, many=True
            )

            colors_data[color_name]["images"] = {}

            for prod_color_image in color_images_serializer.data:
                viewName = prod_color_image["viewName"]
                colors_data[color_name]["images"][viewName] = prod_color_image["image"]

    data["colors"] = colors_data

    return Response(data)


@api_view(["GET"])
def getDesignCategories(request):
    categories = DesignCategory.objects.filter(show=True)
    serializer = DesignCategorySerializer(categories, many=True)
    return Response(serializer.data)

@api_view(["GET"])
def getDesignCategory(request, category):
    if category == 'all':
        designs = Design.objects.filter(show=True)
    else:
        category_check = DesignCategory.objects.get(_id=category, show=True)
        designs = Design.objects.filter(show=True, design_Category=category)
    serializer = DesignSerializer(designs, many=True)
    return Response(serializer.data)

@api_view(["GET"])
def getDesign(request, id):
    design = Design.objects.get(show=True, _id=id)
    serializer = DesignSerializer(design, many=False)
    return Response(serializer.data)