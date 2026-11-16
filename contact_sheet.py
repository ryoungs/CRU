import glob
import math
import os
from PIL import Image, ImageDraw, ImageFont
import datetime as dt


def filter_thumbs(file_list, substring):
    """    Filters out files from the list that do not contain the given substring.
    :param file_list: List of file names (strings)
    :param substring: The substring to check for
    :return: A list of file names that contain the substring"""

    return [file for file in file_list if substring not in file]

def make_contact_sheet(fnames,ncols,nrows,photo,margins, padding):
    """
    Make a contact sheet from a group of filenames:
    Preparation to post on social media

    fnames       A list of names of the image files
    
    ncols        Number of columns in the contact sheet
    nrows        Number of rows in the contact sheet
    photow       The width of the photo thumbs in pixels
    photoh       The height of the photo thumbs in pixels

    marl         The left margin in pixels
    mart         The top margin in pixels
    marr         The right margin in pixels
    marl         The left margin in pixels

    padding      The padding between images in pixels

    returns a PIL image object.
    """
    photow = photo[0]
    photoh = photo[1]

    # Read in all images and resize appropriately
    imgs = [Image.open(fn).resize((photow,photoh)) for fn in fnames]

    # Calculate the size of the output image, based on the
    #  photo thumb sizes, margins, and padding
    marw = margins[0]+margins[2]
    marh = margins[1]+margins[3]

    padw = (ncols-1)*padding
    padh = (nrows-1)*padding
    isize = (ncols*photow+marw+padw,nrows*photoh+marh+padh)

    # Create the new image. The background doesn't have to be white
    white = (255,255,255)
    inew = Image.new('RGB',isize,white)

    # Insert each thumb:
    for irow in range(nrows):
        for icol in range(ncols):
            left = margins[0] + icol*(photow+padding)
            right = left + photow
            upper = margins[1] + irow*(photoh+padding)
            lower = upper + photoh
            bbox = (left,upper,right,lower)
            try:
                img = imgs.pop(0)
            except:
                break
            inew.paste(img,bbox)
    return inew

def save_contact_sheet(n_images):
    """Creates Contact Sheet and save image to archives"""
        
    # all_files = glob.glob("/thumbs/*.jpg")
    # substr = '_T'

    # files = filter_thumbs(all_files,substr)

    files = glob.glob("./pfMedia/*.jpg")
    
    d0 = dt.date.today().isoformat()
    csheet = 'contact_sheet_' + d0 + '.png'
    
    ncols = 6
    nrows = math.ceil(n_images/ncols)

    # Don't bother reading in files we aren't going to use
    if len(files) > ncols*nrows: files = files[:ncols*nrows]

    # These are all in terms of pixels roughly the same aspect ratio as prep'd images:
    photow,photoh = 165,180    
    photo = (photow,photoh)

    margins = [5,5,5,5]

    padding = 1

    inew = make_contact_sheet(files,ncols,nrows,photo,margins,padding)
    inew.save(csheet)

    # use
if __name__ == '__main__':  # This will run if the file is run directly
    save_contact_sheet(14)