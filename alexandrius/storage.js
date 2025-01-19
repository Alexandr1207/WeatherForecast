export function saveFavourite(name)
{
    if(name.trim().length > 0)
    {
        let counter = 0;
        for(let i = 0; i < localStorage.length; i++)
        {
            counter++;  
        }
        return localStorage.setItem(counter, name);
    }
}

export function getFavoirites()
{
    const cities = [];
    for(let i = 0; i < localStorage.length; i++) {
        if(localStorage.getItem(i) != null)
        {
            cities.push(localStorage.getItem(i));
        }
    }
    return cities;
}

export function getCurrent(name)
{
    for(let i=0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
            if(localStorage.getItem(key) == name){
                return 1;
            }
    }
    return -1;
}