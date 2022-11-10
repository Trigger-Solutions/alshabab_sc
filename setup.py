from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in alshabab_sc/__init__.py
from alshabab_sc import __version__ as version

setup(
	name="alshabab_sc",
	version=version,
	description="alshabab-sc",
	author="Trigger-Solutions",
	author_email="trigger-Solutions-eg@gmail.com",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
