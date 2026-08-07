from django.shortcuts import render

# from .products import products
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
    product = Product.objects.get(
        _id=pk,
        show=True,
    )

    serializer = ProductDesignerSerializer(
        product,
        many=False,
    )

    return Response(serializer.data)


@api_view(["GET"])
def getDesignCategories(request):
    categories = DesignCategory.objects.filter(show=True)
    serializer = DesignCategorySerializer(categories, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def getDesignCategory(request, category):
    if category == "all":
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


@api_view(["GET"])
def getDesignerProduct(
    request,
    pk,
):
    product = Product.objects.get(
        _id=pk,
        show=True,
    )

    serializer = ProductDesignerSerializer(
        product,
        many=False,
    )

    return Response(serializer.data)


@api_view(["GET"])
def getDetailedDesign(
    request,
    id,
):
    design = Design.objects.get(
        _id=id,
        show=True,
    )

    serializer = DetailedDesignSerializer(
        design,
        many=False,
    )

    return Response(serializer.data)


@api_view(["GET"])
def getFonts(request):

    fonts = Font.objects.all()

    return Response(
        [
            {
                "name": f.name,
                "style": f.style,
            }
            for f in fonts
        ]
    )


@api_view(["GET"])
def getVinylColors(request):

    colors = VinylColor.objects.filter(
        show=True,
        is_available=True,
    )

    return Response(
        [
            {
                "name": c.name,
                "rgb": c.rgb_Code,
            }
            for c in colors
        ]
    )
