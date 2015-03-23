from django.shortcuts import render, get_object_or_404

from SpotMe.models import Area

# full area view
def index(request):
    area_list = Area.objects.order_by('-floor')
    context = {'area_list': area_list }
    return render(request, 'SpotMe/index.html', context)

# detail page on single area
def detail(request, area_id):
    area = get_object_or_404(Area, pk=area_id)
    return render(request, 'SpotMe/detail.html', {'area': area})
