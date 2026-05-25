from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['image']

class ProductColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductColor
        fields = ['_id', 'color_Name', 'color_RGB', 'show']

class ProductColorSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductColorSize
        fields = ['size', 'countInStock']

class ProductColorImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductColorImage
        fields = ['image', 'viewName']

class DesignCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = DesignCategory
        fields = '__all__'


class DesignSerializer(serializers.ModelSerializer):
    class Meta:
        model = Design
        fields = '__all__'
