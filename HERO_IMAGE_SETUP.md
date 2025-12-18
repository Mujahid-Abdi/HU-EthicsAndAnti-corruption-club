# Hero Image Setup Instructions

## Image Placement
To use the custom ethics hero image on the homepage:

1. ✅ **COMPLETED**: The ethics club image has been saved as `ethics-hero.png` in the `public/` folder
2. The image will automatically be used as the hero background on the homepage
3. If the image is not found, it will fallback to the default Unsplash image

## Image Requirements
- **Filename**: `ethics-hero.png` ✅ **ADDED**
- **Location**: `public/ethics-hero.png` ✅ **CONFIRMED**
- **Recommended size**: 1920x1080 or larger
- **Format**: PNG (high quality with transparency support)

## Admin Interface
When an admin user signs in, they will see:
- **Admin Dashboard** instead of the regular homepage
- **Full admin panel** with all management tabs
- **No regular user interface** - only admin functionality

## Regular Users
Non-admin users will see:
- **Regular homepage** with hero section
- **Custom ethics image** as background
- **All standard user features** and navigation

## Technical Details
- Image path: `/ethics-hero.png` ✅ **UPDATED**
- Fallback: Unsplash university image
- Admin detection: Uses `useAuth().isAdmin`
- Responsive design: Works on all screen sizes
- Transparent navbar: Hero image shows through navigation bar ✅ **NEW**

## Navbar Transparency
The navigation bar has been made transparent to showcase the hero image:
- **Background**: Semi-transparent with backdrop blur effect
- **Light mode**: `bg-white/10` with `backdrop-blur-md`
- **Dark mode**: `bg-gray-900/10` with `backdrop-blur-md`
- **Borders**: Subtle transparent borders for definition
- **Mobile menu**: Also transparent with matching styling
- **Hover effects**: Consistent transparent hover states

This creates a seamless visual experience where the beautiful ethics hero image is visible through the navigation bar.