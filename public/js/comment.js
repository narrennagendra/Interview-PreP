$('[data-toggle="collapse"]').on('click', function() {
    var $this = $(this),
        $parent = typeof $this.data('parent')!== 'undefined' ? $($this.data('parent')) : undefined;
    if($parent === undefined) { /* Just toggle my  */
      $this.find('.glyphicon').toggleClass('glyphicon-chevron-up glyphicon-chevron-down');
      return true;
    }
    /* Open element will be close if parent !== undefined */
    var currentIcon = $this.find('.glyphicon');
    currentIcon.toggleClass('glyphicon-chevron-down glyphicon-chevron-up');
    $parent.find('.glyphicon').not(currentIcon).removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
  });