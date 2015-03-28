from django.shortcuts import render_to_response, get_object_or_404

from SpotMe.models import Area
from SpotMe.search import AreaForm

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
    if request.method == 'POST':
        form = AreaForm(request.POST)
        if form.is_valid():
            # do filtering logic here

    else:
        form = AreaForm()

    return render(request, 'SpotMe/search.html', {'form' : form})