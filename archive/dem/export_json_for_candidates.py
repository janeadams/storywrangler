#!/usr/bin/env python
# coding: utf-8

# In[1]:


import requests


# In[2]:


handles=[    ['@BilldeBlasio','@JulianCastro','@ewarren','@amyklobuchar','@JayInslee','@TulsiGabbard','@TimRyan','@CoryBooker','@BetoORourke','@JohnDelaney','#DemDebate'],    ['@marwilliamson','@Hickenlooper','@AndrewYang','@JoeBiden','@SenSanders','@KamalaHarris','@PeteButtigieg','@SenGillibrand','@SenatorBennet','@ericswalwell','#DemDebate'],    ['@BilldeBlasio','@JulianCastro','@ewarren','@amyklobuchar','@JayInslee','@TulsiGabbard','@TimRyan','@CoryBooker','@BetoORourke','@JohnDelaney','@marwilliamson','@Hickenlooper','@AndrewYang','@JoeBiden','@SenSanders','@KamalaHarris','@PeteButtigieg','@SenGillibrand','@SenatorBennet','@ericswalwell','#DemDebate']]
words=[    ['deblasio','castro','warren','klobuchar','inslee','gabbard','tulsi','ryan','booker','beto','delaney','#demdebate'],    ['williamson','hickenlooper','yang','biden','bernie','sanders','kamala','harris','gillibrand','bennet','swalwell','#demdebate'],    ['deblasio','castro','warren','klobuchar','inslee','gabbard','tulsi','ryan','booker','beto','delaney','williamson','hickenlooper','yang','biden','bernie','sanders','kamala','harris','gillibrand','bennet','swalwell','#demdebate']]


# In[5]:


def save_json(q):
    q=q.lower()
    url = 'http://hydra.uvm.edu:3001/api/onegrams/'+q
    r = requests.get(url, allow_redirects=True)
    filepath=str('json/'+q+'.json')
    open(filepath, 'wb').write(r.content)


# In[6]:


for handle in handles[2]:
    save_json(handle)
for word in words[2]:
    save_json(word)


# In[ ]:




