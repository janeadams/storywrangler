
from setuptools import setup, find_packages

with open("README.rst", "r") as fh:
    long_description = fh.read()

with open("requirements.txt") as f:
    libs = f.read().splitlines()

setup(
    name="storywrangling",
    version="1.0.0",
    description="API for the Storywrangler project",
    long_description=long_description,
    long_description_content_type="text/x-rst",
    keywords="NLP twitter ngrams",
    url="https://gitlab.com/compstorylab/storywrangling",
    author="Thayer Alshaabi",
    author_email="thayer.alshaabi@uvm.edu",
    packages=find_packages(),
    package_data={'storywrangling': ['resources/*.bin', 'resources/*.csv', 'resources/*.json']},
    python_requires=">=3.6",
    install_requires=libs,
    license="MIT",
    classifiers=[
        "Intended Audience :: Science/Research",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Topic :: Text Processing :: Linguistic",
        "Operating System :: OS Independent",
    ],
)
