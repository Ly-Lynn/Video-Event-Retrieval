def calculate_iou(box1, box2):
    x1, y1, x2, y2 = box1
    x1_, y1_, x2_, y2_ = box2

    # Calculate the intersection area
    xi1 = max(x1, x1_)
    yi1 = max(y1, y1_)
    xi2 = min(x2, x2_)
    yi2 = min(y2, y2_)
    intersection = max(0, xi2 - xi1) * max(0, yi2 - yi1)
    box1_area = (x2 - x1) * (y2 - y1)
    box2_area = (x2_ - x1_) * (y2_ - y1_)
    union = box1_area + box2_area - intersection
    return intersection / union if union != 0 else 0

def search_od(images, input_objects):
    def calculate_score(image_data):
        total_score = 0
        image_objects = {obj['object']: obj for obj in image_data['objects']}
        
        for input_obj in input_objects:
            input_name = input_obj['object']
            input_bbox = input_obj['bbox']
            
            if input_name in image_objects:
                label_bbox = image_objects[input_name]['bbox']
                conf = image_objects[input_name]['conf']
                iou_score = calculate_iou(input_bbox, label_bbox)
                combined_score = iou_score + conf
                total_score += combined_score
        return total_score
    images_sorted = sorted(images, key=calculate_score, reverse=True)
    return images_sorted

if __name__ == '__main__':
    search_od()