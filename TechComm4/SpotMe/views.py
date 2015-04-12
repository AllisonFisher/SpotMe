from django.shortcuts import render_to_response, get_object_or_404, render
from django.utils import timezone
from django.views.generic.edit import FormView
from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from SpotMe.models import Area, AreaSerializer, AreaDeSerializer
from SpotMe.forms import AreaForm

# full area view
def index(request):
    area_list = Area.objects.order_by('-floor')
    context = {'area_list': area_list }
    return render(request, 'SpotMe/index.html', context)

# detail page on single area
def detail(request, area_id):
    area = get_object_or_404(Area, pk=area_id)
    return render(request, 'SpotMe/detail.html', {'area': area})

# search based on attributes
def search(request):
    
    objs = Area.objects.all()

    if request.method == 'POST':
        
        form = AreaForm(request.POST)
        
        if form.is_bound and form.is_valid():
        
            # check if requested number of chairs/tables/etc
            # is at most the amount present    
            # or skip if blank
            def check(area, key, val):
                attr_val = getattr(area, key)
                attr_val is None or attr_val >= val

            # filter out those objects which don't have the criteria
            for key, val in form.cleaned_data.items:
                objs = [area for area in objs if check(area, key, val)]

    else:
        form = AreaForm()

    return render(request, 'SpotMe/search.html', {'form' : form, 'objs': objs})

@api_view(['GET', 'POST'])
def area_list(request):
    # request all areas or update an existing one
    if request.method == 'GET':
        areas = Area.objects.all()
        serializer = AreaSerializer(areas, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = AreaDeSerializer(data=request.data)
        if serializer.is_valid():
            # check if the area already exists
            try:
                area = Area.objects.get(id=serializer.validated_data['id'])
            except DoesNotExist:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            setattr(area, 'curr_occupancy', serializer.validated_data['curr_occupancy'])
            setattr(area, 'curr_tables_used', \
                serializer.validated_data['curr_tables_used'])
            setattr(area, 'curr_whiteboards_used', \
                serializer.validated_data['curr_whiteboards_used'])
            setattr(area, 'last_updated', timezone.now())
            area.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
