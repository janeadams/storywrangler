#!/usr/bin/env python
# coding: utf-8

# In[16]:


import pickle
import re


# In[17]:


def get_emojis_parser():
    """ Load a regular expression that matches emojis
    :return: a compiled regex
    """
    print('Loading emoji parser...')
    with open('ngrams.bin', "rb") as f:
        return pickle.load(f)


# In[22]:


e = get_emojis_parser()


# In[23]:


get_emojis_parser()


# In[37]:


import emoji
print(emoji.demojize(str(e)))


# In[ ]:




