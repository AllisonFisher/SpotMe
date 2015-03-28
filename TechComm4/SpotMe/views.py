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
    
    objs = Area.objects.all()

    if request.method == 'POST':
        
        form = AreaForm(request.POST, initial={'seating': 0, 'whiteboards': 0,
                                               'outlets': 0, 'tables': 0})
        
        if form.is_bound and form.is_valid():
        
            # check if requested number of chairs/tables/etc.
            # is at most the amount present    
            def check(area, key, val):
                getattr(area, key) >= val

            # filter out those objects which don't have the criteria
            for key, val in form.cleaned_data.items:
                objs = [area for area in objs if check(area, key, val)]

    else:
        form = AreaForm()

    return render(request, 'SpotMe/search.html', {'form' : form, 'objs': objs})